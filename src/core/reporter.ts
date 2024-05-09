/* eslint-disable class-methods-use-this */
import { IBaseData, LData, ReportParams, ReporterConfig, NavigationTimingPolyfillEntry } from './type';
import { Eid } from './constant';
import { formatDate, guid } from '../utils/helper';
import Storage from './storage';
import Scheduler from './scheduler';

const getNavigationEntryFromPerformanceTiming = (): NavigationTimingPolyfillEntry => {
  const { timing } = performance;
  const { type } = performance.navigation;

  const navigationEntry: { [key: string]: number | string } = {
    entryType: 'navigation',
    startTime: 0,
    type: type === 2 ? 'back_forward' : type === 1 ? 'reload' : 'navigate',
  };

  for (const key in timing) {
    if (key !== 'navigationStart' && key !== 'toJSON') {
      navigationEntry[key] = Math.max((timing[key as keyof PerformanceTiming] as number) - timing.navigationStart, 0);
    }
  }
  return navigationEntry as unknown as NavigationTimingPolyfillEntry;
};

interface IError extends Event {
  colno?: string;
  filename?: string;
  lineno?: string;
  message?: string;
  error?: Error;
  name?: string;
  target: (EventTarget & { src?: string }) | null;
}

const defaultMaxTasks = 20;

function assertConfig(config: ReporterConfig) {
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

  return true;
}

export default class Reporter {
  static instance: Reporter;

  config: ReporterConfig = {} as ReporterConfig;

  baseData!: IBaseData;

  // 数据缓冲区
  storage!: Storage;

  scheduler!: Scheduler;

  reportedEids: Set<string> = new Set();

  constructor(config: ReporterConfig) {
    if (config) this.config = { ...this.config, ...config };

    if (!Reporter.instance) Reporter.instance = this;
    console.log('实例化成功');
    return Reporter.instance;
  }

  /**
   * 初始化方法
   *
   * @return {*}
   * @memberof Reporter
   */
  init() {
    console.log('init called');
    if (!this.config) {
      console.log('无配置信息，初始化失败');
      return false;
    }
    const { appId, userId, maxTasks = defaultMaxTasks } = this.config;

    this.config.dsn = this.config.dsn;

    const traceId = guid();

    if (!assertConfig(this.config)) {
      return false;
    }

    this.baseData = {
      appId,
      traceId,
      uid: userId,
      ua: navigator.userAgent,
      href: window.location.href,
    };

    this.storage = new Storage({ maxTasks });
    this.scheduler = new Scheduler({
      maxTasks,
      storage: this.storage,
      client: this,
    });

    this.timing();
    this.listenError();
    this.overrideFetch();
    this.overrideXHR();

    console.log('初始化 成功');
    return true;
  }

  /**
   * 实例暴露给外部自定义上报的方法
   *
   * @param {ReportParams} { data, runTime }
   * @return {*}
   * @memberof Reporter
   */
  public report({ data, runTime }: ReportParams) {
    const _runTime = runTime || 'delay';
    if (!data) return;
    let pkgData: LData[] = [];
    if (Array.isArray(data)) {
      if (!data.length) return;
      pkgData = data;
    } else {
      pkgData = [data];
    }
    pkgData.forEach(
      (o) =>
        [Eid.jsException, Eid.performance, Eid.requestException, Eid.resourceException].includes(o.eid) &&
        this.reportedEids.add(o.eid),
    );

    pkgData = pkgData.map((o) => ({ ...o, t: formatDate(new Date()) }));
    if (_runTime === 'delay') {
      const overflow = this.storage.push(pkgData);
      if (overflow) this.scheduler.consume();
    } else if (_runTime === 'immediately') {
      this.immediate(pkgData);
    }
  }

  /**
   * 无需等待, 立即上报一个任务
   *
   * @param {IData} data
   * @return {*}
   * @memberof Schedule
   */
  private immediate(data: LData[]) {
    this.send(
      { ...this.baseData, list: data },
      {
        url: `${this.config.dsn}/report`,
      },
    );
  }

  /**
   * 接口上报数据
   *
   * @param {any} data
   * @param {boolean} [sync=false]
   * @return {*}
   * @memberof Browser
   */
  send(data: any, config?: { url?: string }, sync = false) {
    const { url = '/' } = config || {};
    const body = JSON.stringify(data);

    // if (typeof navigator.sendBeacon === 'function') {
    //   return Promise.resolve(navigator.sendBeacon(url, body));
    // }

    if (typeof fetch === 'function') {
      return fetch(url, {
        method: 'POST',
        keepalive: true,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      }).then(() => {
        return true;
      });
    }
    return new Promise<boolean>((r, j) => {
      const XHR = new XMLHttpRequest();
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
  }

  /**
   * XHR劫持
   *
   * @return {*}
   * @memberof Browser
   */
  private overrideXHR() {
    if (!XMLHttpRequest) return;
    const _this = this;

    const _open = XMLHttpRequest.prototype.open;
    const _send = XMLHttpRequest.prototype.send;

    // @ts-ignore
    XMLHttpRequest.prototype.open = function (...args) {
      const [method, url] = args as Parameters<XMLHttpRequest['open']>;
      const startTime = formatDate(new Date());

      this.reporterCollect = {
        ...this.reporterCollect,
        method,
        url: typeof url === 'string' ? url : url.toString(),
        startTime,
      };
      _open.apply(this, args as Parameters<XMLHttpRequest['open']>);
    };
    XMLHttpRequest.prototype.send = function (...args) {
      this.addEventListener('loadend', () => {
        const endTime = formatDate(new Date());
        const { status, statusText } = this;
        if (status > 200 || !status) {
          this.reporterCollect = {
            ...this.reporterCollect,
            endTime,
            status: String(status),
            statusText,
          };

          const { url } = this.reporterCollect;
          if (url.toString().indexOf(_this.config.dsn) !== -1) {
            return;
          }
          _this.report({
            data: {
              eid: Eid.requestException,
              ...this.reporterCollect,
            },
          });
        }
      });

      _send.apply(this, args);
    };
  }

  /**
   * fetch 劫持
   *
   * @return {*}
   * @memberof Browser
   */
  overrideFetch() {
    if (typeof window.fetch !== 'function') {
      return;
    }
    const _this = this;

    const originFetch = window.fetch;
    window.fetch = (...args: any) => {
      const startTime = Math.floor(Date.now() / 1000);
      const url = args[0];
      const config = args[1];
      const { method = 'GET' } = config || {};
      const reportData: Record<string, string | number> = {
        url: url as string,
        startTime,
        method,
        type: 'fetch',
      };

      if (url.toString().indexOf(_this.config.dsn) !== -1) return originFetch.apply(window, args);

      return originFetch
        .apply(window, args)
        .then((result) => {
          const { status, statusText } = result;
          if (status && status > 300) {
            const endTime = Math.floor(Date.now() / 1000);
            Object.assign(reportData, {
              status: String(status),
              statusText,
              endTime,
            });
            _this.report({
              data: {
                eid: Eid.requestException,
                ...reportData,
              },
            });
          }
          return result;
        })
        .catch((error: any) => {
          const endTime = Date.now();
          const { name, message } = error;
          Object.assign(reportData, { name, message });

          reportData.endTime = endTime;
          _this.report({
            data: {
              eid: Eid.requestException,
              ...reportData,
            },
          });

          return error;
        });
    };
  }

  /**
   * Js 异常捕捉
   *
   * @param {Reporter} client
   * @memberof Browser
   */
  listenError() {
    window.addEventListener(
      'error',
      (e: IError) => {
        const { type, error, message, colno, filename, lineno } = e;
        // js 报错捕捉
        if (type === 'error' && filename && colno && lineno) {
          this.report({
            data: {
              eid: Eid.jsException,
              name: message,
              colno,
              message: error?.message,
              filename,
              lineno,
              stack: error?.stack,
            },
          });
        } else {
          const src = e.target?.src;
          if (type === 'error' && src) {
            this.report({
              data: {
                eid: Eid.resourceException,
                src,
              },
            });
          }
        }
      },
      true,
    );
  }

  /**
   * 性能计算入口
   * @returns
   */
  timing() {
    if (!PerformanceObserver) {
      console.error('系统版本过低，无法采集性能数据');
      return;
    }

    this.navigationTiming();
  }

  /**
   * 首屏性能数据采集
   *
   * @param {Reporter} client
   * @memberof Browser
   */
  navigationTiming() {
    const supportTypes = PerformanceObserver.supportedEntryTypes;

    const getNavigation = () => {
      if (supportTypes.includes('navigation')) {
        const entries = performance.getEntriesByType('navigation') || [];
        const navigation = entries[0];
        if (navigation) return navigation as PerformanceNavigationTiming;
      }
      return getNavigationEntryFromPerformanceTiming();
    };

    const fcpP = new Promise<null | number>((r) => {
      if (supportTypes.includes('paint')) {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              r(entry.startTime);
            }
          });
        });
        observer.observe({ type: 'paint', buffered: true });
      } else {
        r(null);
      }
    });

    const lcpP = new Promise<null | number>((r) => {
      if (supportTypes.includes('largest-contentful-paint')) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          r(lastEntry.startTime);
        });
        observer.observe({
          type: 'largest-contentful-paint',
          buffered: true,
        });
      } else {
        r(null);
      }
    });

    const loadP = new Promise((r) => {
      window.addEventListener('load', r);
    });

    Promise.all([fcpP, lcpP, loadP]).then(([fcp, lcp]) => {
      const navigation = getNavigation();
      const {
        connectStart,
        connectEnd,
        domainLookupStart,
        domainLookupEnd,
        fetchStart,
        loadEventEnd,
        loadEventStart,
        entryType,
        initiatorType,
        domComplete,
        domInteractive,
        requestStart,
        responseStart,
        responseEnd,
        name,
        decodedBodySize,
        encodedBodySize,
        nextHopProtocol,
        domContentLoadedEventEnd,
        domContentLoadedEventStart,
        duration,
      } = navigation;

      const ttfb = responseStart - fetchStart;

      if (!fcp && domContentLoadedEventEnd) {
        fcp = domContentLoadedEventEnd;
      }

      if (!lcp) {
        lcp = domInteractive || domComplete || fcp;
      }

      const reportData: Record<string, any> = {
        connectStart,
        connectEnd,
        domainLookupStart,
        domainLookupEnd,
        fetchStart,
        loadEventEnd,
        loadEventStart,
        responseEnd,
        responseStart,
        entryType,
        initiatorType,
        domContentLoadedEventEnd,
        domContentLoadedEventStart,
        domComplete,
        domInteractive,
        requestStart,
        name,
        decodedBodySize,
        encodedBodySize,
        nextHopProtocol,
        lcp,
        fcp,
        ttfb,
        duration,
        ntype: performance.navigation?.type,
      };

      Object.keys(reportData).forEach((key) => {
        if (typeof reportData[key] === 'number') {
          reportData[key] = Math.round(reportData[key]);
        }
      });

      this.report({
        runTime: 'immediately',
        data: {
          eid: Eid.performance,
          ...reportData,
        },
      });
      console.log('首屏性能数据已上报');
    });
  }
}
